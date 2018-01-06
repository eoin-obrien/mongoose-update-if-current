import * as gulp from 'gulp';
import * as ts from 'gulp-typescript';
import * as runSequence from 'run-sequence';
import * as merge from 'merge2';
import * as del from 'del';

const tsProject = ts.createProject('tsconfig.json');

gulp.task('build', () => {
  const tsResult = tsProject.src()
    .pipe(tsProject());
  return merge([
    tsResult.dts.pipe(gulp.dest('typings')),
    tsResult.js.pipe(gulp.dest('dist')),
  ]);
});

gulp.task('clean', () => del(['dist/**', '!dist', 'typings/**', '!typings']));

gulp.task('default', (done) => {
  runSequence('clean', 'build', done);
});
