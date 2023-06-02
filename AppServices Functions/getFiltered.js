// This function is the endpoint's request handler.
exports = function ({ query, headers, body }, response) {
  const jsonBody = JSON.parse(body.text());

  const bookIds = jsonBody.bookids;
  const filter = jsonBody.filter;
  const sortOrder = jsonBody.sortOrder;

  var aggreation = [
    {
      $search: {
        compound: {
          must: [],
          should: [],
          minimumShouldMatch: 1,
        },
        sortBetaV1: {
          title: sortOrder,
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
  filter.map((filter) => {
    aggreation[0].$search.compound.must.push({
      text: {
        query: filter.value,
        path: filter.path,
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
