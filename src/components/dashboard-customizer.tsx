'use client';

import { useState } from 'react';
import { Settings, Eye, EyeOff, GripVertical, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useDashboardPreferences, type DashboardSection } from '@/stores/dashboard-preferences';
import { cn } from '@/lib/utils';

export function DashboardCustomizer() {
  const [open, setOpen] = useState(false);
  const { sections, setSectionVisibility, reorderSections, resetToDefaults } = useDashboardPreferences();
  const [draggedItem, setDraggedItem] = useState<DashboardSection | null>(null);
  const [dragOverItem, setDragOverItem] = useState<DashboardSection | null>(null);

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  const handleDragStart = (e: React.DragEvent, sectionId: DashboardSection) => {
    setDraggedItem(sectionId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, sectionId: DashboardSection) => {
    e.preventDefault();
    if (draggedItem && draggedItem !== sectionId) {
      setDragOverItem(sectionId);
    }
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: DashboardSection) => {
    e.preventDefault();
    if (draggedItem && draggedItem !== targetId) {
      const currentOrder = sortedSections.map((s) => s.id);
      const draggedIndex = currentOrder.indexOf(draggedItem);
      const targetIndex = currentOrder.indexOf(targetId);

      currentOrder.splice(draggedIndex, 1);
      currentOrder.splice(targetIndex, 0, draggedItem);

      reorderSections(currentOrder);
    }
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const visibleCount = sections.filter((s) => s.visible).length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Personnaliser</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Personnaliser le tableau de bord</DialogTitle>
          <DialogDescription>
            Affichez ou masquez les sections et réorganisez-les par glisser-déposer.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">
              {visibleCount} / {sections.length} sections visibles
            </span>
            <Button variant="ghost" size="sm" onClick={resetToDefaults} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Réinitialiser
            </Button>
          </div>
          <div className="space-y-2">
            {sortedSections.map((section) => (
              <div
                key={section.id}
                draggable
                onDragStart={(e) => handleDragStart(e, section.id)}
                onDragOver={(e) => handleDragOver(e, section.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, section.id)}
                onDragEnd={handleDragEnd}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border bg-card transition-all cursor-move',
                  draggedItem === section.id && 'opacity-50',
                  dragOverItem === section.id && 'border-primary border-2',
                  !section.visible && 'opacity-60'
                )}
              >
                <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className={cn('text-sm', !section.visible && 'text-muted-foreground')}>
                    {section.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {section.visible ? (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Switch
                    checked={section.visible}
                    onCheckedChange={(checked) => setSectionVisibility(section.id, checked)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
