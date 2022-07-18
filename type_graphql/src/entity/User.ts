import { Entity, Column, BaseEntity, ObjectIdColumn } from "typeorm";
import { ObjectType, Field, ID, Root } from "type-graphql";

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field(() => ID)
    @ObjectIdColumn()
    id: number;

    @Field()
    @Column()
    firstName: string;

    @Field()
    @Column()
    lastName: string;

    @Field()
    @Column("text", { unique: true })
    email: string;

    @Field(() => String, { nullable: true })
    name(@Root() parent: User): string {
        return `${parent.firstName} ${parent.lastName}`;
    }

    @Column()
    password: string;
}
