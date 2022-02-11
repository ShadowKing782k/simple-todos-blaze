import { Template } from 'meteor/templating';
import { TasksCollection } from '../db/TasksCollection';

import { ReactiveDict } from 'meteor/reactive-dict';
 
import './App.html';
import '../ui/dropdown.html';
import './Task.js';
import '../ui/Login.js';



const IS_LOADING_STRING = "isLoading";
const SEARCH_STATUS = "searchString";
 const getUser = () => Meteor.user();
const isUserLogged = () => !!getUser();

const getTasksFilter = (text) => {
  const user = getUser();



  const hideCompletedFilter = { isChecked: { $ne: true } };

  const userFilter = user ? { userId: user._id } : {};
  const searchFilter = text.length?{text: {$regex : text}} : {};
  const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter, ...searchFilter };

 
  return { userFilter, pendingOnlyFilter };
}

Template.mainContainer.helpers({
  tasks() {

    
    const instance = Template.instance();
    const option = instance.state.get("optionToSort");
    const hideCompleted = instance.state.get(HIDE_COMPLETED_STRING);

    searchText = instance.state.get(SEARCH_STATUS);

    const { userFilter, pendingOnlyFilter } = getTasksFilter(searchText);

    const searchFilter = searchText.length?{...userFilter, text : {$regex : searchText }} : userFilter;


    if (!isUserLogged()) {
      return [];
    }

    if(option === "Date Created")
    {
        return TasksCollection.find(hideCompleted ? pendingOnlyFilter : searchFilter, {
      sort: { createdAt: 1 },
    }).fetch();


    }

    else
    {
      return TasksCollection.find(hideCompleted ? pendingOnlyFilter : searchFilter, {
      sort: { Priority: -1 },
    }).fetch();

    }
  },



  

   hideCompleted() {
    return Template.instance().state.get(HIDE_COMPLETED_STRING);
  },

  isLoading() {
    const instance = Template.instance();
    return instance.state.get(IS_LOADING_STRING);
  },

  incompleteCount() {
    if (!isUserLogged()) {
      return '';
    }

    const { pendingOnlyFilter } = getTasksFilter();

    const incompleteTasksCount = TasksCollection.find(pendingOnlyFilter).count();
    return incompleteTasksCount ? `(${incompleteTasksCount})` : '';
  },

  isUserLogged(){
    
    return isUserLogged();

  },

  getUser() {
    return getUser();
  }

});


const HIDE_COMPLETED_STRING = "hideCompleted";

Template.mainContainer.events({

    "click #hide-completed-button"(event, instance){
        const currentHideCompleted = instance.state.get(HIDE_COMPLETED_STRING);


        instance.state.set(HIDE_COMPLETED_STRING, !currentHideCompleted);

    }, 

    'click .user'() {
    
    Meteor.logout();
    Router.go('/');
  },

});

Template.form.events({
  "submit .task-form"(event) {
    
    const textInput = document.querySelector('.taskInput');



    const text = textInput.value;
    const priority = $('#Priority').find(":selected").text();
    if(text.length === 0)
        return;
    let priorityNumber = 1;
    switch(priority){

      case "low":
        priorityNumber = 1;
        break;

      case "medium":
        priorityNumber = 2;
        break;

      case "high":
        priorityNumber = 3;
    }
     const matchesAlreadyPresent = TasksCollection.find({userId : getUser()._id, text : text}).fetch();
    
    if(matchesAlreadyPresent.length != 0)
    {
      alert(`record ${text} already exists`);
      return;
    }

    Meteor.call('tasks.insert', text, priorityNumber);

    textInput.value = '';
   
  },

   
})

Template.mainContainer.events({

    'change #order'(){

        const instance = Template.instance();
  
        const optiontoSort = $('#order').find(':selected').text();
        instance.state.set("optionToSort", optiontoSort);
        Template.mainContainer.__helpers.get('tasks').call();

       
    },
}
);

Template.mainContainer.events({

  'submit .search-form'(e){

      e.preventDefault();

      const instance = Template.instance();

      const searchText = $('#searchbar').val();


      instance.state.set(SEARCH_STATUS, searchText);

      Template.mainContainer.__helpers.get('tasks').call();

  },

  



});


Template.mainContainer.onCreated(
    function mainContainerOnCreated(){
    this.state = new ReactiveDict();
    this.state.set("hideCompleted", false);
    this.state.set("optionToSort", "Priority");
    
    this.state.set(SEARCH_STATUS, "");

    const handler = Meteor.subscribe('tasks');
  Tracker.autorun(() => {
    this.state.set(IS_LOADING_STRING, !handler.ready());
  });

    }
)
