export const jsonGenerate = (
  statusCode: Number,
  message: String,
  data: String | Number
) => {
  return { status: statusCode, message: message, data: data };
};
