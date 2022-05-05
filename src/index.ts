import 'reflect-metadata';
import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { UserService } from './services/UserService';
import { UserRepository } from './repositories/UserRepository';
import { MockRepository } from './mocks/MockRepository';
const app: Application = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/:env', async (req: Request, res: Response): Promise<Response> => {
  const mockRepo = new MockRepository();
  const realRepo = new UserRepository();

  let userService: UserService;

  if (req.params.env === 'test') {
    userService = new UserService(mockRepo);
  } else {
    userService = new UserService(realRepo);
  }
  userService.getUserData();

  return res.status(200).send({
    message: `Hello World! from ${req.params.env}`,
  });
});

try {
  app.listen(PORT, (): void => {
    console.log(`Connected successfully on port ${PORT}`);
  });
} catch (error: any) {
  console.error(`Error occured: ${error.message}`);
}
