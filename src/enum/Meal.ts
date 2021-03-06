enum Meal {
    BREAKFAST = 0,
    LUNCH,
    DINNER,
    LATE_NIGHT,
    LATE_NIGHT_SNACKS
}

const MealIdentifier: { 0: number, 1: number, 2: number, 3: number, 4: number, getByIndex: (i: number) => number } = {
    [Meal.BREAKFAST]: 192,
    [Meal.LUNCH]: 190,
    [Meal.DINNER]: 191,
    [Meal.LATE_NIGHT]: 232,
    [Meal.LATE_NIGHT_SNACKS]: 232,
    getByIndex: i => MealIdentifier[Object.keys(MealIdentifier)[i]]
};

const MealRange = {
    start: Meal.BREAKFAST,
    end: Meal.LATE_NIGHT_SNACKS,
    all: [Meal.BREAKFAST, Meal.LUNCH, Meal.DINNER, Meal.LATE_NIGHT, Meal.LATE_NIGHT_SNACKS]
};

export { Meal, MealIdentifier, MealRange };