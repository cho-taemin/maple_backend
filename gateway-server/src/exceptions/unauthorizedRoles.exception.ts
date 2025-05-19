import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedRolesException extends HttpException {
  constructor() {
    // 응답 객체를 생성
    const response = {
      statusCode: HttpStatus.FORBIDDEN,
      message: '접근 권한이 없습니다.',
      error: 'Forbidden',
    };

    // 부모 클래스 생성자에 응답 객체와 상태 코드 전달
    super(response, HttpStatus.FORBIDDEN);
  }
}
