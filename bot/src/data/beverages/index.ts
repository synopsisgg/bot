import { Collection, type ReadonlyCollection } from '@discordjs/collection';

import { beveragesArray } from './list';
import { type Beverage, type Modifier } from './types';
import { pickOne } from '~/helpers/functions';

export const beverages: ReadonlyCollection<string, Beverage> = new Collection(
    beveragesArray.map((beverage) => [beverage.identifier, beverage])
);

export const weighedRoll = <T extends { weight: number }>(
    collection: ReadonlyCollection<string, T>,
    totalWeight?: number
) => {
    totalWeight = totalWeight ?? collection.reduce((acc, item) => acc + item.weight, 0);
    const roll = Math.random() * totalWeight;

    let weight = 0;
    for (const item of collection.values()) {
        if (weight <= roll && roll < weight + item.weight) {
            return item;
        }
        weight += item.weight;
    }

    throw new Error('Unable to roll an item.');
};

export const rollModifier = (item: Beverage): Modifier | null => {
    if (item.modifiers === undefined || item.modifiers.length === 0) return null;

    const rolledModifiers = [];
    for (const modifier of item.modifiers) {
        const roll = Math.random();
        if (roll < modifier.chance) rolledModifiers.push(modifier);
    }

    if (rolledModifiers.length > 0) return pickOne(rolledModifiers);
    return null;
};

export const rollBeverage = () => weighedRoll(beverages, beveragesTotalWeight);

export const rollBeverageWithModifier = () => {
    const beverage = rollBeverage();
    const modifier = rollModifier(beverage);

    return {
        beverage,
        modifier,
        points: Math.round(beverage.points * (modifier?.multiplier ?? 1)),
    };
};

const beveragesTotalWeight = beverages.reduce((acc, beverage) => acc + beverage.weight, 0);

export const beverageChances = beverages
    .map((beverage) => ({
        identifier: beverage.identifier,
        chance: beverage.weight / beveragesTotalWeight,
    }))
    .sort((a, b) => b.chance - a.chance);

export * from './types';
export * from './list';
