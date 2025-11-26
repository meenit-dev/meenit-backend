import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@notionhq/client';

@Injectable()
export class NotionService {
  private readonly notion: Client;
  private readonly notionId: string;

  constructor(private readonly config: ConfigService) {
    this.notion = new Client({ auth: this.config.get('NOTION_SECRET') });
    this.notionId = this.config.get('NOTION_ID');
    console.log(this.notionId);
    this.createIssue();
  }

  async createIssue() {
    const db = await this.notion.pages.properties.retrieve({
      page_id: '2b74f26d965480ff9c0cdadef6a9667e',
    });

    console.log(JSON.stringify(db, null, 2));

    // const response = await this.notion.pages.create({
    //   parent: {
    //     database_id: '2b74f26d965480ff9c0cdadef6a9667e',
    //   },
    //   properties: {
    //     // Name: {
    //     //   title: [
    //     //     {
    //     //       text: {
    //     //         content: '새로운 이슈',
    //     //       },
    //     //     },
    //     //   ],
    //     // },
    //     // Status: {
    //     //   status: {
    //     //     name: '백로그',
    //     //   },
    //     // },
    //     // Description: {
    //     //   rich_text: [
    //     //     {
    //     //       text: {
    //     //         content: '이슈 설명 내용',
    //     //       },
    //     //     },
    //     //   ],
    //     // },
    //   },
    // });

    // return response;
  }
}
