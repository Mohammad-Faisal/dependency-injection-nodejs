import { Service } from 'typedi';

@Service()
export class UserRepository {
  someFunction = () => {
    // expensive database calls
    console.info('This is real user repository');
  };
}
