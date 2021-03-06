// Third party modules
import { firestore, Change, CloudFunction, EventContext } from 'firebase-functions';

// Dashboard hub firebase functions models/mappers
import { Logger } from '../client/logger';
import { DocumentData, DocumentSnapshot, FirebaseAdmin } from './../client/firebase-admin';

export const onUpdateRepository: CloudFunction<Change<DocumentSnapshot>> = firestore
  .document('repositories/{repositoryUid}')
  .onUpdate((change: Change<DocumentSnapshot>, context: EventContext) => {

    try {
      const newData: DocumentData = change.after.data();

      if (!newData.projects || Array.isArray(newData.projects) && newData.projects.length === 0) {
        return FirebaseAdmin.firestore().collection('repositories').doc(context.params.repositoryUid).delete();
      }

      return newData;

    } catch (err) {
      Logger.error(err);
      throw new Error(err);
    }

  });
