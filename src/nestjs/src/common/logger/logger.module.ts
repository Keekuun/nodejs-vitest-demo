import { Module } from '@nestjs/common';
import { Logger } from './logger.ts';

@Module({
  providers: [Logger],
  // 导出Logger给其他模块共享
  exports: [Logger]
})
export class LoggerModule {}
