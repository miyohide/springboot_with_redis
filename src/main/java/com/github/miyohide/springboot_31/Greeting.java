package com.github.miyohide.springboot_31;

import java.util.Date;

public class Greeting {
  private final String id;
  private final String content;
  private final long createdAt;

  public Greeting(String id, String content, long createdAt) {
    this.id = id;
    this.content = content;
    this.createdAt = createdAt;
  }

  public String getId() {
    return id;
  }

  public String getContent() {
    return content;
  }

  public long getCreatedAt() {
    return createdAt;
  }
}
