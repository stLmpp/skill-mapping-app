import { Injectable } from '@angular/core';
import { DefaultTitleStrategy, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class TitleResolver extends DefaultTitleStrategy {
  override buildTitle(snapshot: RouterStateSnapshot): string | undefined {
    const title = super.buildTitle(snapshot);
    return title ? `${title} - Skill Mapping` : 'Skill Mapping';
  }
}
