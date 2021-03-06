import { MonitorModel } from './monitor.model';

/**
 * Project Model for functions
 */
export class ProjectModel {
  
  monitors?: MonitorModel[] = [];
  uid?: string = '';
  url?: string = '';

  constructor(uid: string = '') {
    this.uid = uid;
  }
}
