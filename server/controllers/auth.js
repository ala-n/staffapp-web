const users = require('../dao/users');
const service = require('../services/auth');

async function checkEmail(req, res) {
  try {
    const email = await users.checkUserEmail(req.body.email);
    if (email) {
      res.send();
      return;
    }
    res.status(401).end();
  } catch (err) {
    res.status(500).end();
  }
}

async function login(req, res) {
  try {
    if (!req.body.email || !req.body.password) {
      throw new Error('400');
    }
    const user = await service.promisifiedAuthenticate(req, res);
    if (!user) {
      res.status(401).end();
      return;
    }
    req.logIn(user, (error) => {
      if (error) {
        res.status(401).end();
        return;
      }
      res.end();
    });
  } catch (err) {
    if (err.message === '401') {
      res.status(401).end();
      return;
    }
    if (err.message === '400') {
      res.status(400).end();
      return;
    }
    res.status(500).send(err.message);
  }
}

function logout(req, res) {
  if (!req.user) {
    res.status(401).end();
    return;
  }
  req.session.destroy((err) => {
    if (err) {
      res.status(500).end();
      return;
    }
    res.end();
  });
}

module.exports = {
  checkEmail,
  login,
  logout,
};