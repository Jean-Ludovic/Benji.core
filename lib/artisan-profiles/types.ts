import { artisanProfiles } from './schema';

export type ArtisanProfile = typeof artisanProfiles.$inferSelect;
export type NewArtisanProfile = typeof artisanProfiles.$inferInsert;
