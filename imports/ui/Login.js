import { Template } from 'meteor/templating';

import '../ui/dropdown.html';

// import { FlowRouter } from 'meteor/kadira:flow-router';



 
// import './App.html';
// import '../ui/dropdown.html';
// import './Task.js';



import './login.html';

 
Template.login.events({

    'submit .login-form'(e) {
    e.preventDefault();

    const target = e.target;

    const username = target.username.value;
    const password = target.password.value;

    Meteor.loginWithPassword(username, password,
       (error) =>{

            if(error)
                console.log(error.reason);

            else
                Router.go("/home");

       } );
  }

});