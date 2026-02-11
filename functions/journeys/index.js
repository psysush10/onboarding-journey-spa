/**
 * 
 * @param {import('./types/basicio').Context} context 
 * @param {import('./types/basicio').BasicIO} basicIO 
 */
module.exports = (context, basicIO) => {
  try {
    const response = {
      journeys: [
        {
          id: "1",
          customerName: "Acme Corp",
          status: "In Progress"
        },
        {
          id: "2",
          customerName: "Globex",
          status: "Completed"
        }
      ]
    };

    basicIO.write(JSON.stringify(response));
    context.close();
  } catch (err) {
    basicIO.write(JSON.stringify({ error: err.message }));
    context.close();
  }
};
