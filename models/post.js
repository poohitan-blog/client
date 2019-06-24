export default {
  name: 'post',
  schema: {
    title: String,
    body: String,
    path: String,
    tags: [String],
    views: Number,
    draft: Boolean,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
    publishedAt: Date,
  },
};
