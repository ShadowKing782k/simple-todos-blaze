import { Template } from 'meteor/templating';

import { TasksCollection } from '../db/TasksCollection';

import './Task.html';

import './App.html';

Template.task.events({
  'click .toggle-checked'() {
    Meteor.call('tasks.setIsChecked', this._id, !this.isChecked);
  },
  'click .delete'() {
    Meteor.call('tasks.remove', this._id);
  },
});

Template.task.helpers({

  getPriority(){

    const instance = Template.instance();
    

    // console.log(instance);


    const value = instance['data']['text'];

  

    const priority = TasksCollection.find(
      {text : value}, {Priority:1, _id:0, user_id:0}
    ).fetch();

    if(priority.length === 0)
      return;

    const priNumber = priority[0]['Priority'];
    let priorityString = "";
    switch(priNumber)
    {
        case 1:
          priorityString = "low";
          break;

        case 2:
          priorityString = "medium";
         
          break;

        case 3:
          priorityString = "high";
          
          break;


    }

    return priorityString;
    

  },

  getCreatedDate(){

       const instance = Template.instance();

       if(!instance)
          return;
    const value = instance['data']['text'];

  

    const priority = TasksCollection.find(
      {text : value}, {Priority:1, _id:0, user_id:0}
    ).fetch();
    
    if(priority.length === 0)
      return;

    let date = "";
    date = priority[0]['createdAt'].getDate() + "/";
    date += priority[0]['createdAt'].getMonth() + "/";
    date += priority[0]['createdAt'].getFullYear()
    return date;
     

  },


});

