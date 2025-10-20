const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.auth = async (req, res) => {
  var response = {
    data: null,
    message: "",
    code: 500,
  };

  try {
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.SECRET || "development",
      { expiresIn: "7h" }
    );

    const expiresAt = new Date(Date.now() + 7 * 60 * 60 * 1000);

    response = {
      data: {
        token,
        expiresAt,
      },
      code: 200,
      message: "Token Valid",
    };
    return res.status(200).send(response);
  } catch (error) {
    response.message = error.detail ? error.detail : error.message;
    res.status(500).send(response);
  }
};