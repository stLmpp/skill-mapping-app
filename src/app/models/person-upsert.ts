export interface PersonUpsert {
  eid: string;
  lastCustomerId: number;
  chapterId: number;
  careerLevelId: number;
  lastJobRoleId: number;
  peopleLeadEid: string;
  skills: PersonUpsertSkill[];
  otherInformation?: string;
  interests?: number[];
  languages?: PersonUpsertLanguage[]
}

export interface PersonUpsertSkill {
  skillId: number;
  skillLevelId: number;
}

export interface PersonUpsertLanguage {
  languageId: number;
  skillLevelId: number;
}
