const earthers = [
  { name: 'Peter', age: 10 },
  { name: 'Rita', age: 8 },
  { name: 'Severus', age: 58 },
  { name: 'Polly', age: 46 },
  { name: 'Rebecca', age: 13 },
  { name: 'Harry', age: 70 },
  { name: 'Lulu', age: 32 },
  { name: 'Sandy', age: 24 },
  { name: 'Morris', age: 12 },
];

exports.up = async (sql) => {
  await sql`
    INSERT INTO earthers ${sql(earthers, 'name', 'age')}
  `;
};

exports.down = async (sql) => {
  for (const earther of earthers) {
    await sql`
      DELETE FROM
			  earthers
      WHERE
			  name = ${earther.name} AND
			  age = ${earther.age}
    `;
  }
};
