// This function is the endpoint's request handler.
exports = function ({ query, headers, body }, response) {
  const jsonBody = JSON.parse(body.text());

  const bookIds = jsonBody.bookids;

  var aggreation = [
    {
      $searchMeta: {
        index: "default",
        facet: {
          operator: {
            compound: {
              should: [],
            },
          },
          facets: {
            authorFacet: {
              type: "string",
              path: "authors.name",
              numBuckets: 7,
            },
            typeFacet: {
              type: "string",
              path: "book_type",
              numBuckets: 7,
            },
            contentFacet: {
              type: "string",
              path: "content_type",
              numBuckets: 7,
            },
            langFacet: {
              type: "string",
              path: "language",
              numBuckets: 7,
            },
          },
        },
      },
    },
  ];

  bookIds.map((id) => {
    aggreation[0].$searchMeta.facet.operator.compound.should.push({
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
