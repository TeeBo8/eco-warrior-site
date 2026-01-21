import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  integer,
  real,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk User ID
  email: text("email").notNull().unique(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  
  // 👇 NOUVEAUX CHAMPS POUR LA GESTION PREMIUM 👇
  stripeCustomerId: text("stripe_customer_id").unique(),
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripePriceId: text("stripe_price_id"),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end"),
  freeTrialMessageCount: integer("free_trial_message_count").default(0).notNull(),
  
  // 👇 NOUVEAUX CHAMPS POUR LES ARTICLES PREMIUM 👇
  articleViewCount: integer("article_view_count").default(0).notNull(),
  articleViewResetAt: timestamp("article_view_reset_at").defaultNow().notNull(),
});

// 👇 NOUVELLE TABLE POUR L'EMPREINTE CARBONE 👇
export const carbonFootprints = pgTable("carbon_footprints", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  
  totalEmissions: real("total_emissions").notNull(),
  transportEmissions: real("transport_emissions").notNull(),
  dietEmissions: real("diet_emissions").notNull(),
  energyEmissions: real("energy_emissions").notNull(),
});

// 👇 ÉNUMÉRATIONS POUR LE SYSTÈME SOCIAL 👇
// Suppression des enums non utilisés dans la nouvelle logique
// export const postStatusEnum = pgEnum("post_status", ["pending", "approved", "rejected"]);
// export const voteTypeEnum = pgEnum("vote_type", ["UP", "DOWN"]);

// 👇 NOUVELLE TABLE `posts` SIMPLIFIÉE (contenu éditorial contrôlé) 👇
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  slug: varchar("slug", { length: 255 }).unique(),
  
  mythFr: text("myth_fr").notNull(),
  realityFr: text("reality_fr").notNull(),
  mythEn: text("myth_en").notNull(),
  realityEn: text("reality_en").notNull(),
  source: text("source"),

  likes: integer("likes").default(0).notNull(),
});

// 👇 NOUVELLE TABLE `likes` (remplace votes) 👇
export const likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  postId: integer("post_id").notNull().references(() => posts.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  // Un utilisateur ne peut liker qu'une seule fois un post
  return {
    unique_user_post_like: uniqueIndex("unique_user_post_like_idx").on(table.userId, table.postId),
  };
});

// 👇 TABLE LIKES ANONYMES (sans contrainte FK sur userId) 👇
export const anonymousLikes = pgTable("anonymous_likes", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(), // ID de session localStorage, pas de FK
  postId: integer("post_id").notNull().references(() => posts.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    unique_session_post_like: uniqueIndex("unique_session_post_like_idx").on(table.sessionId, table.postId),
  };
});

// 👇 NOUVELLE TABLE `comments` 👇
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  authorId: text("author_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  postId: integer("post_id").notNull().references(() => posts.id, { onDelete: 'cascade' }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 👇 NOUVELLE TABLE POUR LA CHRONOLOGIE 👇
export const timelineEvents = pgTable("timeline_events", {
  id: serial("id").primaryKey(),
  year: integer("year").notNull(),
  title_en: text("title_en").notNull(),
  title_fr: text("title_fr").notNull(),
  description_en: text("description_en").notNull(),
  description_fr: text("description_fr").notNull(),
  icon: varchar("icon", { length: 50 }), // Nom de l'icône de lucide-react
});

// 👇 NOUVELLE TABLE POUR LA CARTE INTERACTIVE 👇
export const mapPoints = pgTable("map_points", {
  id: serial("id").primaryKey(),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  name_en: text("name_en").notNull(),
  name_fr: text("name_fr").notNull(),
  impact_en: text("impact_en").notNull(),
  impact_fr: text("impact_fr").notNull(),
  category: varchar("category", { length: 50 }), // ex: "erosion", "heatwave", "biodiversity"
  image_url: text("image_url"), // URL de l'image d'illustration
});

// 👇 TABLE 1 : DÉFINITION DE TOUS LES BADGES POSSIBLES 👇
export const badges = pgTable("badges", {
  id: varchar("id", { length: 50 }).primaryKey(), // Un identifiant textuel unique, ex: "first_calculation"
  name_en: text("name_en").notNull(),
  name_fr: text("name_fr").notNull(),
  description_en: text("description_en").notNull(),
  description_fr: text("description_fr").notNull(),
  icon: varchar("icon", { length: 50 }).notNull(), // Nom de l'icône lucide-react
});

// 👇 TABLE 2 : LIEN ENTRE UTILISATEURS ET BADGES OBTENUS 👇
export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  badgeId: varchar("badge_id", { length: 50 }).notNull().references(() => badges.id, { onDelete: 'cascade' }),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
}, (table) => {
  // On s'assure qu'un utilisateur ne peut pas avoir deux fois le même badge
  return {
    unique_user_badge: uniqueIndex("unique_user_badge_idx").on(table.userId, table.badgeId),
  };
});

// 👇 NOUVELLE TABLE POUR LES ARTICLES 👇
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(), // Pour l'URL, ex: "transition-electrique-en-panne"
  
  titleFr: text("title_fr").notNull(),
  titleEn: text("title_en").notNull(),
  
  // On stockera le contenu en format Markdown
  contentFr: text("content_fr").notNull(),
  contentEn: text("content_en").notNull(),
  
  // Un court résumé pour la page de listing
  summaryFr: text("summary_fr").notNull(),
  summaryEn: text("summary_en").notNull(),

  // URL de l'image de couverture
  imageUrl: text("image_url"), 

  author: text("author").default("L'équipe EcoWarrior").notNull(),
  publishedAt: timestamp("published_at").defaultNow().notNull(),
});

// 👇 DÉFINITION DES RELATIONS 👇
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  likes: many(likes),
  comments: many(comments),
  carbonFootprints: many(carbonFootprints),
  userBadges: many(userBadges),
}));

export const postsRelations = relations(posts, ({ many }) => ({
  likes: many(likes),
  comments: many(comments),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
}));

export const carbonFootprintsRelations = relations(carbonFootprints, ({ one }) => ({
  user: one(users, {
    fields: [carbonFootprints.userId],
    references: [users.id],
  }),
}));

export const userBadgesRelations = relations(userBadges, ({ one }) => ({
  user: one(users, {
    fields: [userBadges.userId],
    references: [users.id],
  }),
  badge: one(badges, {
    fields: [userBadges.badgeId],
    references: [badges.id],
  }),
}));

export const badgesRelations = relations(badges, ({ many }) => ({
  userBadges: many(userBadges),
})); 