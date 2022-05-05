Dependency Injection is a powerful technique in object oriented programming that helps us to decouple our application in a way that we can take advantage of different implementation of the same class according to our needs.

#### Why Dependency Injection?

I am glad you asked. Let's imagine a scenario where we have a service named `UserService` which in calls the `UserRepository` to fetch the data from the database and return that.

```js
`UserService` -> Business Logic
`UserRepository` -> Takes care of our database calls.
```

What's wrong with doing everything inside one class?

Well that's a clear violation of Single Responsibility Principle. We should avoid that in any production level application.

Now in reality the implementation of `UserService` can look something like this.

```js
const userService = new UserService();

return await userService.getUserDetails(userId);
```

And our `UserService` can look something like this.

```js
import UserRepository from './UserRepository';
export class UserService {
  getSomeData = () => {
    const userRepo = new UserRepository();
  };
}
```

### What's wrong with this?

Now it works in general but there is a problem. We are directly creating the instance of `UserRepository` inside our `UserService` class which results in a tight coupling.

When we will need to test this class we will be required to create a mock implementation of the `UserRepository` class but in our current implementation that is not possible.

This is where dependency injection comes in. It basically says that we need to avoid initializing the `UserRepository` class inside our `UserService` and rather pass it from above.

### Options

There are many options. For example we can create our own dependency container and create the instances ourselves and inject them in the runtime.

But we can use library named [typedi](https://docs.typestack.community/typedi/01-getting-started) that takes care of the dependencies for us. This is really a clean and simple way to manage dependency injection in our application.

There are some other popular options like [inversify](https://inversify.io/) and [awilix](https://github.com/jeffijoe/awilix) that you can consider but I found TypeDI to be much more cleaner than the others so that'w why we are using this.

Today we will see how we can use `typedi` to achieve dependency injection in a NodeJS application.

### Install the dependency

Let's first install the dependency.

```sh
npm install typedi reflect-metadata
```

Then modify our `tsconfig.json` file to work with the `typedi` properly. Add the following 3 options under the `compilerOptions`

```json
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "strictPropertyInitialization": false // this one is for preventing the typescript errors while using @Inject()
```

Now import `reflect-metadata` at the beginning of our application. Like the following inside `index.ts` file.

```js
import 'reflect-metadata';
```

### Mark a service as injectable

Now we need to identify which services we want to inject. In our example this is the `UserRepository` class. Let's tell `typedi` to treat it as a `Service` class so that it automatically creates a copy of it and inject whenever needed.

First import the `Service` from typedi

```js
import { Service } from 'typedi';

@Service()
export class UserRepository {
  /// all your class code goes here.

  someFunction = () => {
    // expensive database calls
  };
}
```

### Use our injectable class at any place

Now, instead of initializing the instance of UserRepository we can get the instance from `typedi`.

There are multiple way to do this. Let's see how...

#### First way: Get from global container

We can get the instance of UserRepository from the global container.

```js
import { UserRepository } from './UserRepository';
import { Service, Inject, Container } from 'typedi';

@Service()
export class UserService {
  logUserData = () => {
    const userRepo = Container.get(UserRepository);
    userRepo.someFunction();
  };
}
```

#### Second way: Inject the class

We can get the instance of UserRepository from the global container.

```js
import { UserRepository } from './UserRepository';
import { Service, Inject, Container } from 'typedi';

@Service()
export class UserService {
  @Inject()
  userRepo: UserRepository;

  logUserData = () => {
    this.userRepo.someFunction();
  };
}
```

#### Third way: Using constructor

We can get the instance of UserRepository from the global container.

```js
import { UserRepository } from "./UserRepository";
import { Service, Inject, Container } from "typedi";

@Service()
export class UserService {

  constructor(public userRepo: UserRepository) {}

  logUserData = () => {
    this.userRepo.someFunction();
  };
}
```

So in this way you can avoid creating the instance of `UserRepository` directly inside `UserService` and when you will need a mock implementation just pass down the mock instance into it.

Let's say we need to test this in a test environment.

```js
const mockRepo = new MockRepository();
const realRepo = new UserRepository();

let userService: UserService;

// create UserService based on the environment
if (req.params.env === 'test') {
  userService = new UserService(mockRepo);
} else {
  userService = new UserService(realRepo);
}
userService.getUserData();
```

If you look closely you will see that our UserService is no longer responsible for creating the instance of UserRepository.

That's how we can achieve dependency injection in NodeJS.

### Video Format:

https://youtu.be/I6_ka5fMQCo

### Github Repo

https://github.com/Mohammad-Faisal/dependency-injection-nodejs
