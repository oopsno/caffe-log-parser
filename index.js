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
      for (let j = i + 1; j < lines.length - 1; ++j) {
        const match = lines[j].match(/Test net output #\d+: (\S+) = (\d(\.\d+)?)/);
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

function trainCSV(train_output) {
  let train_csv = ['iteration,loss,'];
  train_output.forEach((s) => {
    train_csv.push(`${s.iteration},${s.loss},`)
  });
  return train_csv.join('\n');
}

function testCSV(test_output) {
  if (test_output.length == 0) {
    return '';
  } else {
    const head = test_output[0];
    const fields = Object.keys(head).filter((x) => x != 'iteration');
    let test_csv = [`iteration,${fields.join(',')},`];
    test_output.forEach((s) => {
      test_csv.push(`${s.iteration},${fields.map((f) => s[f]).join(',')},`);
    });
    return test_csv.join('\n');
  }
}

function toCSV({train_output, test_output}) {
  return {
    train_csv: trainCSV(train_output),
    test_csv: testCSV(test_output)
  }
}

exports.parse = parse;
exports.toCSV = toCSV;
