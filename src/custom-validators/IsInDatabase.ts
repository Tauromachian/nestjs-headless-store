import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { EntityManager } from 'typeorm';

@ValidatorConstraint({ async: true })
export class IsInDatabaseConstraint implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}

  async validate(value: unknown, args: ValidationArguments) {
    const [EntityClass, property = 'id'] = args.constraints;

    const repository = this.entityManager.getRepository(EntityClass);

    const row = await repository.findOne({
      where: { [property]: value },
    });

    return !!row;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} does not exist in database`;
  }
}

export function IsInDatabase<G>(
  entity: G,
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entity, property],
      validator: IsInDatabaseConstraint,
    });
  };
}
