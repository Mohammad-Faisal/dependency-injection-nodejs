import { UserRepository } from '../repositories/UserRepository';
import { Service, Container, Inject } from 'typedi';

@Service()
export class UserService {
  constructor(public userRepo: UserRepository) {}

  getUserData = () => {
    this.userRepo.someFunction();
  };
}
