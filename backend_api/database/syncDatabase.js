const sequelize = require("./index"); // Your sequelize instance
const Location = require("./models/Location");
const User = require("./models/User");
const Email = require("./models/Email");
const Estate = require("./models/Estate");
const Blog = require("./models/Blog");
const Project = require("./models/Project");
const Category = require("./models/Category");
const Comment = require("./models/Comment");
const Tag = require("./models/Tag");
const Media = require("./models/Media");
const Notification = require("./models/Notification");
const Partner = require("./models/Partner");
const Url = require("./models/Url");
const Team = require("./models/Team");
const Testimony = require("./models/Testimony");

// Define associations here

// Location <-> User (One-to-Many)
Location.hasMany(User, { foreignKey: "location_id", as: "user" });
User.belongsTo(Location, { foreignKey: "location_id", as: "location" });

// User <-> Blog (One-to-Many)
User.hasMany(Blog, { foreignKey: "user_id", as: "blog" });
Blog.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Define associations with alias
Location.hasMany(Estate, { foreignKey: "location_id", as: "estate" });
Estate.belongsTo(Location, { foreignKey: "location_id", as: "location" });

// User <-> Comment relationship
User.hasMany(Comment, { foreignKey: "user_id", as: "comment" });
Comment.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Blog <-> Comment (Many-to-Many through BlogComment)
Comment.belongsToMany(Blog, {
  through: "BlogComment",
  foreignKey: "comment_id",
});
Blog.belongsToMany(Comment, { through: "BlogComment", foreignKey: "blog_id" });

// Project <-> Comment (Many-to-Many through ProjectComment)
Comment.belongsToMany(Project, {
  through: "ProjectComment",
  foreignKey: "comment_id",
});
Project.belongsToMany(Comment, {
  through: "ProjectComment",
  foreignKey: "project_id",
});

// Estate <-> Comment (Many-to-Many through EstateComment)
Comment.belongsToMany(Estate, {
  through: "EstateComment",
  foreignKey: "comment_id",
  onDelete: "CASCADE",
});
Estate.belongsToMany(Comment, {
  through: "EstateComment",
  foreignKey: "estate_id",
  onDelete: "CASCADE",
});

// Project <-> Media (Many-to-Many through ProjectMedia)
Media.belongsToMany(Project, {
  through: "ProjectMedia",
  foreignKey: "media_id",
  onDelete: "CASCADE",
});
Project.belongsToMany(Media, {
  through: "ProjectMedia",
  foreignKey: "project_id",
  onDelete: "CASCADE",
});

// Estate <-> Media (Many-to-Many through EstateMedia)
Estate.belongsToMany(Media, {
  through: {
    model: "EstateMedia",
    attributes: [],
  },
  foreignKey: "estate_id",
  onDelete: "CASCADE",
});

Media.belongsToMany(Estate, {
  through: {
    model: "EstateMedia",
    attributes: [],
  },
  foreignKey: "media_id",
  onDelete: "CASCADE",
});

// Blog <-> Media (Many-to-Many through BlogMedia)
Media.belongsToMany(Blog, {
  through: "BlogMedia",
  foreignKey: "media_id",
  onDelete: "CASCADE",
});
Blog.belongsToMany(Media, {
  through: "BlogMedia",
  foreignKey: "blog_id",
  onDelete: "CASCADE",
});

// Category <-> Blog  (Many-to-Many)
Category.belongsToMany(Blog, {
  through: "BlogCategories",
  foreignKey: "category_id",
  onDelete: "CASCADE",
});
Blog.belongsToMany(Category, {
  through: "BlogCategories",
  foreignKey: "blog_id",
  onDelete: "CASCADE",
});

// Category <->  Project (Many-to-Many)
Category.belongsToMany(Project, {
  through: "ProjectCategories",
  foreignKey: "category_id",
  onDelete: "CASCADE",
});
Project.belongsToMany(Category, {
  through: "ProjectCategories",
  foreignKey: "project_id",
  onDelete: "CASCADE",
});

// Category <-> estate (Many-to-Many)
Category.belongsToMany(Estate, {
  through: "EstateCategories",
  foreignKey: "category_id",
  onDelete: "CASCADE",
});
Estate.belongsToMany(Category, {
  through: "EstateCategories",
  foreignKey: "estate_id",
  onDelete: "CASCADE",
});

// Tag <-> Blog and Project (Many-to-Many)
Tag.belongsToMany(Blog, { through: "BlogTag", foreignKey: "tag_id" });
Blog.belongsToMany(Tag, { through: "BlogTag", foreignKey: "blog_id" });

Tag.belongsToMany(Project, { through: "ProjectTag", foreignKey: "tag_id" });
Project.belongsToMany(Tag, { through: "ProjectTag", foreignKey: "project_id" });

// Team <-> Url (Many-to-Many through TeamUrl)
Team.belongsToMany(Url, {
  through: "TeamUrl",
  foreignKey: "team_id",
  otherKey: "url_id", // explicitly setting the other key
});

Url.belongsToMany(Team, {
  through: "TeamUrl",
  foreignKey: "url_id",
  otherKey: "team_id", // explicitly setting the other key
});
// Blog <-> Url (Many-to-Many through BlogUrl)
Blog.belongsToMany(Url, { through: "BlogUrl", foreignKey: "blog_id" });
Url.belongsToMany(Blog, { through: "BlogUrl", foreignKey: "url_id" });

// Project <-> Url (Many-to-Many through ProjectUrl)
Project.belongsToMany(Url, { through: "ProjectUrl", foreignKey: "project_id" });
Url.belongsToMany(Project, { through: "ProjectUrl", foreignKey: "url_id" });

Project.belongsTo(Estate, {
  foreignKey: "estateId",
  as: "estate",
  onDelete: "CASCADE",
});

Estate.hasMany(Project, {
  foreignKey: "estateId",
  as: "projects",
  onDelete: "CASCADE",
});

// Team <-> Estate  (Many-to-Many)
Team.belongsToMany(Estate, { through: "EstateTeam", foreignKey: "team_id" });
Estate.belongsToMany(Team, { through: "EstateTeam", foreignKey: "estate_id" });

Tag.belongsToMany(Project, { through: "ProjectTag", foreignKey: "tag_id" });
Project.belongsToMany(Tag, { through: "ProjectTag", foreignKey: "project_id" });

// Sync database
const syncDatabase = async () => {
  try {
    await sequelize.sync(); // Use { force: true, alter: true  } to drop and recreate tables
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
};

// Export the function
module.exports = syncDatabase;
