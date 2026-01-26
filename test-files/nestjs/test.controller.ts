// Test file to validate NestJS ESLint configuration
import { Controller, Get, Post, Body, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

// Unused import (should be caught by base config)

// Unused variable (should be caught by base config)
const unusedVar = 'test';

// Injectable without proper dependency injection
@Injectable()
export class TestService {
  // Method returning any (should trigger warning)
  getData(): any {
    return { data: 'test' };
  }
}

// Controller with various NestJS patterns
@Controller('test')
export class TestController {
  constructor(private readonly service: TestService) {}

  // Missing return type annotation
  @Get()
  findAll() {
    return this.service.getData();
  }

  // Using any type in parameter
  @Post()
  create(@Body() data: any): Observable<any> {
    return data;
  }
}
