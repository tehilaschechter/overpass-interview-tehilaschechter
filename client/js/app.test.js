const formatDate = require('./app');

// Unsure how date function was operating, so created a unit test to be safe
test("Returns properly formatted date", () => {
    expect(formatDate("1615369401342")).toBe("3/10/2021 11:43:21 AM");
});
