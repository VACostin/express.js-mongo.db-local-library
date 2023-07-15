/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
const { DateTime } = require("luxon");
const mongoose = require("mongoose");

const { Schema } = mongoose;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Virtual for author's full name
AuthorSchema.virtual("name").get(function () {
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }

  return fullname;
});

AuthorSchema.virtual("date_of_birth_formatted").get(function () {
  return DateTime.fromJSDate(this.date_of_birth).toFormat('LLL dd, yyyy');
});

AuthorSchema.virtual("date_of_death_formatted").get(function () {
  return DateTime.fromJSDate(this.date_of_death).toFormat('LLL dd, yyyy');
});

AuthorSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/author/${this._id}`;
});

// Export model
module.exports = mongoose.model("Author", AuthorSchema);
