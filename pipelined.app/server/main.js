import { Meteor } from 'meteor/meteor';
import { Mongo, MongoInternals } from 'meteor/mongo';

import SimpleSchema from 'simpl-schema';
import { PipelinesCollection } from '/imports/api/list';

Meteor.methods({
  async 'todos.get'() {
    try {
      // Get from Database
      let list = await PipelinesCollection.find().fetch();
      console.log("todos.get", list)

      // Publish to Frontend
      Meteor.publish('List', async () => {
        let list = await PipelinesCollection.find();
        return list;
      });

      return list;
    } catch (error) {
      return error;
    }
  },
  async 'todos.create'({ title }) {
    // Validate Data
    new SimpleSchema({
      title: { type: String }
    }).validate({ title });

    try {
      // Save to Database
      let insert = await PipelinesCollection.insert({ title })
      console.log("todos.create", insert)

      let list = await PipelinesCollection.find().fetch();
      console.log("todos.list", list)

      // Publish to Frontend
      Meteor.publish('List', async () => {
        let list = await PipelinesCollection.find();
        return list;
      });

      return list;
    } catch (error) {
      return error;
    }
  },
  async 'todos.update'({ _id, title }) {
    // Validate Data
    new SimpleSchema({
      _id: { type: String },
      title: { type: String }
    }).validate({ _id, title });

    try {
      // Save to Database
      let insert = await PipelinesCollection.update(_id, { title })
      console.log("todos.update", insert)

      // Fetch from Database
      let list = await PipelinesCollection.find().fetch();
      console.log("todos.list", list)

      // Publish to Frontend
      Meteor.publish('List', async () => {
        let list = await PipelinesCollection.find();
        return list;
      });

      return list;
    } catch (error) {
      return error;
    }
  },
  async 'todos.delete'({ id }) {
    // Validate Data
    new SimpleSchema({
      id: { type: String }
    }).validate({ id });

    try {
      // Delete from Database
      let remove = await PipelinesCollection.remove(id)
      console.log("todos.delete", remove)

      // Fetch from Database
      let list = await PipelinesCollection.find().fetch();
      console.log("todos.list", list)

      // Publish to Frontend
      Meteor.publish('List', async () => {
        let list = await PipelinesCollection.find();
        return list;
      });

      return list;
    } catch (error) {
      console.log("Delete Item = ", error)
      throw new Meteor.Error(500, 'Error 500: Not found', `${error}`);
    }
  }
});

Meteor.startup(async () => {
  process.env.MONGO_URL = Meteor.settings.MONGO_URL;
});

