// This function is the endpoint's request handler.
exports = function ({ query, headers, body }, response) {
  const jsonBody = JSON.parse(body.text());

  const book = jsonBody.book;

  var aggreation = [
    {
      $search: {
        index: "moreLikeThis",
        moreLikeThis: {
          like: book,
        },
      },
    },
    { $limit: 3 },
    {
      $project: {
        title: 1,
        "authors.name": 1,
        description: 1,
        "image.coverimage": 1,
      },
    },
  ];

  // Querying a mongodb service:
  return context.services
    .get("mongodb-atlas")
    .db("recommendations")
    .collection("products")
    .aggregate(aggreation);
};
