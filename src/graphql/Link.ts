import {
  extendType,
  idArg,
  intArg,
  nonNull,
  objectType,
  stringArg,
} from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";

export const Link = objectType({
  name: "Link", // <- Name of your type
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("description");
    t.nonNull.string("url");
  },
});

let links: NexusGenObjects["Link"][] = [
  // 1
  {
    id: 1,
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL",
  },
  {
    id: 2,
    url: "graphql.org",
    description: "GraphQL official website",
  },
];

export const LinkQuery = extendType({
  // 2
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("feed", {
      // 3
      type: "Link",
      resolve(parent, args, context, info) {
        // 4
        return links;
      },
    });
  },
});

export const FindLinkByIDQuery = extendType({
  // 2
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("link", {
      // 3
      type: "Link",
      args: {
        id: nonNull(idArg()),
      },
      resolve(parent, args, context, info) {
        // 4
        const id = args.id;
        return links.filter((link) => link.id === Number(id));
      },
    });
  },
});

export const LinkMutation = extendType({
  // 1
  type: "Mutation",
  definition(t) {
    t.nonNull.field("post", {
      // 2
      type: "Link",
      args: {
        // 3
        description: nonNull(stringArg()),
        url: nonNull(stringArg()),
      },

      resolve(parent, args, context) {
        const { description, url } = args; // 4

        let idCount = links.length + 1; // 5
        const link = {
          id: idCount,
          description: description,
          url: url,
        };
        links.push(link);
        return link;
      },
    });
  },
});

export const UpdateLinkMutation = extendType({
  // 1
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateLink", {
      // 2
      type: "Link",
      args: {
        // 3
        id: nonNull(idArg()),
        description: nonNull(stringArg()),
        url: nonNull(stringArg()),
      },
      resolve(parent, args, context) {
        const { description, url, id } = args; // 4

        links
          .filter((link) => link.id === Number(id))
          .forEach((link) => {
            link.description = description;
            link.url = url;
          });
        const link = links.filter((link) => link.id === Number(id))[0];
        return link;
      },
    });
  },
});

export const DeleteLinkMutation = extendType({
  // 1
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deleteLink", {
      // 2
      type: "Link",
      args: {
        // 3
        id: nonNull(idArg()),
      },
      resolve(parent, args, context) {
        const id = args.id; // 4
        var deletedLink;
        const index = links.findIndex((link) => link.id === Number(id));
        if (index > -1) {
          deletedLink = links.splice(index, 1)[0];
        } else {
          throw new Error("link non trovato");
        }
        return deletedLink;
      },
    });
  },
});
