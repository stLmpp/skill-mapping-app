export interface PersonUpsert {
  eid: string;
  lastCustomerId: number;
  chapterId: number;
  careerLevelId: number;
  skills: PersonUpsertSkill[];
  otherInformation?: string;
  interests?: number[];
}

export interface PersonUpsertSkill {
  skillId: number;
  skillLevelId: number;
}
