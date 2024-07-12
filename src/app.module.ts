import {
  MiddlewareConsumer,
  Module,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma.service';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { PostModule } from './post/post.module';
import { AuthGuard } from './auth/auth.guard';
import { ConfigModule } from '@nestjs/config';
import { LessonModule } from './lesson/lesson.module';
import { CourseModule } from './course/course.module';
import { QuizModule } from './quiz/quiz.module';
import { CategoryModule } from './category/category.module';
import { UserProgressModule } from './user-progress/user-progress.module';
import { CommentLessonModule } from './comment-lesson/comment-lesson.module';
import { CommentPostModule } from './comment-post/comment-post.module';
import { SavedPostModule } from './saved-post/saved-post.module';
import { RolesGuard } from './auth/roles.guard';
import { CourseReceivedModule } from './course-received/course-received.module';
import { QuizAnswerModule } from './quiz-answer/quiz-answer.module';
import { PayosModule } from './payos/payos.module';
import { TransactionModule } from './transaction/transaction.module';
import { DiscountModule } from './discount/discount.module';
import { StatisticModule } from './statistic/statistic.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PostModule,
    ConfigModule.forRoot(),
    LessonModule,
    CourseModule,
    QuizModule,
    CategoryModule,
    UserProgressModule,
    CommentLessonModule,
    CommentPostModule,
    SavedPostModule,
    CourseReceivedModule,
    QuizAnswerModule,
    PayosModule,
    TransactionModule,
    DiscountModule,
    StatisticModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    PrismaService,
  ],
})
export class AppModule {}
