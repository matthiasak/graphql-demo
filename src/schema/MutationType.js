import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

import { kebabCase } from "lodash";

import PostType from "./PostType";

export default new GraphQLObjectType({
  name: "Mutation",
  description: "Create a post, comment, or user",

  fields() {
    return {
      createPost: {
        type: PostType,

        args: {
          title: { type: new GraphQLNonNull(GraphQLString) },
          body: { type: new GraphQLNonNull(GraphQLString) },
        },

        resolve(parent, args, context) {
          const { db } = context;

          const { title, body } = args;

          return db("post")
            .insert({
              author_id: 1,
              title,
              slug: kebabCase(title),
              body,
              created_at: new Date(),
            })
            .then(([ id ]) => db("post").first().where("id", id))
          ;
        },
      },

      deletePost: {
        type: GraphQLBoolean,

        args: {
          slug: { type: new GraphQLNonNull(GraphQLString) },
        },

        resolve(parent, args, context) {
          const { db } = context;
          const { post } = context.loader;
          const { slug } = args;

          return db("post")
            .where("slug", slug)
            .del()
            .then(() => post.clear(slug))
          ;
        },
      },

      updatePost: {
        type: PostType,

        args: {
          title: { type: new GraphQLNonNull(GraphQLString) },
          slug: { type: new GraphQLNonNull(GraphQLString) },
          body: { type: new GraphQLNonNull(GraphQLString) },
        },

        resolve(parent, args, context) {
          const { db } = context;
          const { post } = context.loaders;
          const { title, slug, body } = args;

          const newSlug = kebabCase(title);

          return db("post")
            .where("slug", slug)
            .update({
              title,
              slug: newSlug,
              body,
              updated_at: new Date(),
            })
            .then(() => post.clear(slug))
            .then(() => post.load(newSlug))
          ;
        },
      },
    };
  },
});
