package com.github.miyohide.springboot_31;

import java.util.Date;

public class Greeting {
  private final long id;
  private final String content;
  private final Date createdAt;

  public Greeting(long id, String content, Date createdAt) {
    this.id = id;
    this.content = content;
    this.createdAt = createdAt;
  }

  public long getId() {
    return id;
  }

  public String getContent() {
    return content;
  }

  public Date getCreatedAt() {
    return createdAt;
  }
}
