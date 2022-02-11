import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection } from '/imports/db/TasksCollection';

import '/imports/api/tasksPublications';

import '/imports/api/tasksMethods'



const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'password';



Meteor.startup(() => {

    
    
      
      if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }

 


  
});