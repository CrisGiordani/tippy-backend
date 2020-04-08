import jwt from "jsonwebtoken";
import authConfig from "../../config/auth";

import User from "../models/User";

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).send({ error: "E-mail não cadastrado" });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).send({ error: "Senha incorreta" });
    }

    const { id, name, mobile, description, performer, avatar } = user;

    return res.json({
      user: {
        id,
        name,
        email,
        mobile,
        description,
        performer,
        avatar,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
