import { Logger } from '@nestjs/common';
import { Document, FilterQuery, Model } from 'mongoose';

import {
    HasId,
    IListInput,
    IPaginatedList
} from '@cbnsndwch/ghl-app-contracts';

export abstract class CrudService<
    TContract extends HasId,
    TEntity extends TContract,
    TCreateInput extends Partial<Omit<TContract, keyof HasId>> = Partial<
        Omit<TContract, keyof HasId>
    >,
    TUpdateInput extends Partial<TContract> = Partial<TContract>
> {
    protected readonly logger: Logger;

    protected constructor(
        protected readonly model: Model<TEntity & Document>,
        logger?: Logger
    ) {
        this.logger = logger ?? new Logger(this.constructor.name);
    }

    //#region Helpers

    prepareFilter(filter?: Partial<TContract>) {
        if (!filter) {
            return {};
        }

        const sourceFilters = Object.entries(filter)
            .filter(([, value]: [string, any]) => typeof value !== 'undefined')
            .map(([k, value]) => [k, new RegExp(value.toString(), 'i')]);

        return Object.fromEntries(sourceFilters);
    }

    prepareProjection(
        projection?: Array<keyof TContract> | Record<keyof TContract, 0 | 1>
    ) {
        if (!projection) {
            return undefined;
        }

        if (Array.isArray(projection)) {
            return Object.fromEntries(
                projection.map(key => [key, 1] as [string, 1])
            );
        }

        const entries = Object.entries(projection)
            .filter(([k, value]) => {
                return (
                    typeof k === 'string' &&
                    Boolean(k) &&
                    [0, 1].includes(value)
                );
            })
            .map<[string, 0 | 1]>(([k, value]) => [k, value]);

        const select = Object.fromEntries(entries);
        return select;
    }

    //#endregion Helpers

    //#region READ

    /**
     * Get a list of records that match the given filter
     *
     * @param input Pagination input with filters and projection
     */
    async findAll(input: IListInput<TContract> = {}) {
        const {
            filters = {},
            projection = [],
            limit = Number.MAX_SAFE_INTEGER,
            offset = 0
        } = input;

        const filter = this.prepareFilter(filters);
        const select = this.prepareProjection(projection);

        const count = await this.model.countDocuments(filter);
        const items = await this.model
            .find(filter, select)
            .skip(offset)
            .limit(limit);

        const result: IPaginatedList<TContract> = {
            items,
            count,
            limit,
            offset
        };
        return result;
    }

    /**
     * Get a single record that matches the given filters
     *
     * @param input Query filters
     */
    async findOne(input: FilterQuery<TEntity & Document>) {
        const result = await this.model.findOne(input);
        return result;
    }

    /**
     * Find a record by ID
     *
     * @param id The record ID
     */
    async findById(id: string) {
        const result = this.model.findById(id);
        return result;
    }

    //#endregion READ

    //#region WRITE

    /**
     * Create a new record
     *
     * @param input Input data for the CREATE operation
     */
    async create(input: TCreateInput): Promise<TEntity> {
        const result = await this.model.create(input);
        return result;
    }

    /**
     * Update a record by `$set`-ting the given values on it.
     *
     * If multiple records match the given filter, only the first one will be
     * updated. See {@link https://www.mongodb.com/docs/manual/reference/operator/update/set/}
     * for details about the MongoDB $set operator.
     *
     * @param filter The input with filters to find the record to update
     * @param update The input with the new values to `$set` on the record.
     */
    async update(
        filter: FilterQuery<TEntity & Document>,
        update: TUpdateInput
    ) {
        const result = await this.model.findOneAndUpdate(
            filter,
            { $set: update },
            { new: true, multi: false }
        );

        return result;
    }

    /**
     * Deletes a record by ID. This operation is not reversible.
     *
     * @param id The ID of the record to delete
     * @returns The deleted record
     */
    async delete(id: string) {
        // get the record to delete
        const record = await this.model.findById(id);

        if (!record) {
            throw new Error(`No record found with id ${id}`);
        }

        const deleted = await record.deleteOne({ returnOriginal: true });
        return deleted;
    }

    //#endregion WRITE
}
