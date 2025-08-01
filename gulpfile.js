const gulp = require('gulp');
const zip = require('gulp-zip');

function bundle() {
  return gulp.src([
    '**/*',
    '!node_modules/**',
    '!src/**',
    '!tsconfig.json',
    '!gulpfile.js',
    '!*.ts',
    '!*.log',
    '!package-lock.json',
    '!.eslintrc.*',
    '!.gitignore',
    '!.vscode/**',
    '!dist/**'
  ])
  .pipe(zip('n8n-nodes-azure-devops-2020.zip'))
  .pipe(gulp.dest('dist'));
}

exports.bundle = bundle;
exports.build = gulp.series(bundle);