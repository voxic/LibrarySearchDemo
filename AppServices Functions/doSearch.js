// This function is the endpoint's request handler.
exports = function ({ query, headers, body }, response) {
  const jsonBody = JSON.parse(body.text());

  const bookIds = jsonBody.bookids;
  const filter = jsonBody.filter;

  var aggreation = [
    {
      $search: {
        compound: {
          must: [
            {
              text: {
                query: filter,
                path: "title",
                fuzzy: {
                  maxEdits: 2,
                },
              },
            },
          ],
          should: [],
          minimumShouldMatch: 1,
        },
      },
    },
  ];

  bookIds.map((id) => {
    aggreation[0].$search.compound.should.push({
      equals: {
        value: id,
        path: "_id",
      },
    });
  });

  // Querying a mongodb service:
  return context.services
    .get("mongodb-atlas")
    .db("recommendations")
    .collection("products")
    .aggregate(aggreation);
};
