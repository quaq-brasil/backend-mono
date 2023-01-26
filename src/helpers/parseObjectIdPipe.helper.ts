import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, string> {
  public transform(value: any): string {
    try {
      const transformedObjectId: ObjectId = ObjectId.createFromHexString(value);
      return transformedObjectId.toString();
    } catch (error) {
      throw new BadRequestException('Validation failed (id is expected)');
    }
  }
}
