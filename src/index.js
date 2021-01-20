const { ApolloServer } = require('apollo-server');

const fs = require('fs');
const path = require('path');


let links = [{
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
}]

// 2
let idCount = links.length
const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        feed: () => links,
        link: (parent, args) => {
            return links.find(link => link.id === args.id);
        }
    },
    Mutation: {
      post:(parent, args) => {
          const link = {
              id: `link-${idCount++}`,
              description: args.description,
              url: args.url,
          }
          links.push(link)
          return link
      },
        updateLink(parent, args) {
            const linkIndex = links.findIndex(link => link.id === args.id);
            if (linkIndex !== -1) {
                links[linkIndex].url = args.url;
                links[linkIndex].description = args.description;
                return links[linkIndex]
            }
        },
        deleteLink(parent, args) {
            links = links.filter(link => link.id !== args.id);
        }
    }
}

// 3
const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf-8'
    ),
    resolvers
})


server
  .listen()
  .then(({url}) => 
    console.log(`Server is running on ${url}`)
  );
