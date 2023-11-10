package com.github.miyohide.springboot_31;

import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.SessionScope;

import java.io.Serializable;
import java.util.Date;

@SessionScope
@Component
public class SessionInfo implements Serializable {
  private static final long serialVersionUID = 1L;

  private long id;
  private String name;
  private Date createdAt;

  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Date getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Date createdAt) {
    this.createdAt = createdAt;
  }

  @Override
  public String toString() {
    return "SessionInfo{" +
            "id=" + id +
            ", name='" + name + '\'' +
            ", createdAt=" + createdAt +
            '}';
  }
}
