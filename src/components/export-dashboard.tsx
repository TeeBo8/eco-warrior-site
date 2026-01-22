'use client';

import { useState } from 'react';
import { Download, FileImage, FileText, Loader2, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';

interface ExportDashboardProps {
  targetRef: React.RefObject<HTMLElement | null>;
}

export function ExportDashboard({ targetRef }: ExportDashboardProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const getDateString = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  const exportToPNG = async () => {
    if (!targetRef.current) {
      toast({
        title: "Erreur",
        description: "Impossible de capturer le dashboard.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    try {
      const domtoimage = await import('dom-to-image-more');

      const dataUrl = await domtoimage.toPng(targetRef.current, {
        quality: 1,
        scale: 2,
        filter: (node: Node) => {
          // Exclude export buttons
          if (node instanceof Element && node.hasAttribute('data-export-ignore')) {
            return false;
          }
          return true;
        },
      });

      const link = document.createElement('a');
      link.download = `dashboard-climat-${getDateString()}.png`;
      link.href = dataUrl;
      link.click();

      toast({
        title: "Export PNG",
        description: "L'image a été téléchargée avec succès.",
      });
    } catch (error) {
      console.error('Erreur export PNG:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'export.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = async () => {
    if (!targetRef.current) {
      toast({
        title: "Erreur",
        description: "Impossible de capturer le dashboard.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    try {
      const domtoimage = await import('dom-to-image-more');
      const { jsPDF } = await import('jspdf');

      const dataUrl = await domtoimage.toPng(targetRef.current, {
        quality: 1,
        scale: 2,
        filter: (node: Node) => {
          if (node instanceof Element && node.hasAttribute('data-export-ignore')) {
            return false;
          }
          return true;
        },
      });

      // Get dimensions
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => { img.onload = resolve; });

      const imgWidth = img.width;
      const imgHeight = img.height;

      // Create PDF with appropriate orientation
      const orientation = imgWidth > imgHeight ? 'landscape' : 'portrait';
      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Calculate dimensions to fit with margins
      const margin = 10;
      const headerSpace = 25;
      const availableWidth = pageWidth - (margin * 2);
      const availableHeight = pageHeight - headerSpace - margin;

      const ratio = Math.min(availableWidth / imgWidth, availableHeight / imgHeight);
      const finalWidth = imgWidth * ratio;
      const finalHeight = imgHeight * ratio;

      const xOffset = (pageWidth - finalWidth) / 2;

      // Add title
      pdf.setFontSize(14);
      pdf.text('Tableau de Bord du Climat - Eco Warrior', pageWidth / 2, 12, { align: 'center' });

      // Add date
      pdf.setFontSize(9);
      pdf.setTextColor(100);
      pdf.text(`Exporté le ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, 18, { align: 'center' });

      // Add the dashboard image
      pdf.addImage(dataUrl, 'PNG', xOffset, headerSpace, finalWidth, finalHeight);

      pdf.save(`dashboard-climat-${getDateString()}.pdf`);

      toast({
        title: "Export PDF",
        description: "Le PDF a été téléchargé avec succès.",
      });
    } catch (error) {
      console.error('Erreur export PDF:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'export.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const printDashboard = () => {
    window.print();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2" disabled={isExporting} data-export-ignore>
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">Exporter</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48" data-export-ignore>
        <DropdownMenuItem onClick={exportToPNG} className="cursor-pointer" disabled={isExporting}>
          <FileImage className="h-4 w-4 mr-2" />
          Exporter en PNG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF} className="cursor-pointer" disabled={isExporting}>
          <FileText className="h-4 w-4 mr-2" />
          Exporter en PDF
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={printDashboard} className="cursor-pointer">
          <Printer className="h-4 w-4 mr-2" />
          Imprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
