/**
 * @param log {String} The log.
 * @return {{train_output: Array, test_output: Array}} Parsed Log
 */
function parse(log) {
  const lines = log.split('\n').filter((s) => s.search(/\bsolver\.cpp/) != -1);
  let train_output = [], test_output = [];
  lines.forEach((s) => {
    const match = s.match(/Iteration (\d+), loss = (\d(\.\d*)?)/);
    if (match != null) {
      const [_, iteration, loss] = match;
      train_output.push({
        iteration: Number.parseInt(iteration),
        loss: Number.parseFloat(loss)
      });
    }
  });
  lines.forEach((s, i) => {
    const match = s.match(/Iteration (\d+), Testing/);
    if (match != null) {
      const iteration = match[1];
      let output = {iteration: Number.parseInt(iteration)};
      for (let j = 1; i < lines.length - i - 1; ++i) {
        const match = lines[i + j].match(/Test net output #\d+: (\S+) = (\d(\.\d+)?)/);
        console.log(lines[i+j]);
        if (match != null) {
          output[match[1]] = Number.parseFloat(match[2]);
        } else {
          test_output.push(output);
          break;
        }
      }
    }
  });
  return {train_output, test_output};
}

exports.parse = parse;