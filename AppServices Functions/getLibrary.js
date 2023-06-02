// This function is the endpoint's request handler.
exports = function ({ query, headers, body }, response) {
  const profileId = JSON.parse(body.text());

  var match = {
    profileid: profileId.profileId,
  };

  console.log(match);

  var pipeline = [
    {
      $match: match,
    },
    {
      $group: {
        _id: "$profileid",
        id: {
          $addToSet: "$bookid",
        },
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "id",
        foreignField: "_id",
        as: "books",
      },
    },
    {
      $project: {
        _id: 0,
        bookids: "$id",
        books: 1,
      },
    },
  ];

  // Querying a mongodb service:
  return context.services
    .get("mongodb-atlas")
    .db("recommendations")
    .collection("profiles-library")
    .aggregate(pipeline);
};
