package com.github.miyohide.springboot_31;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Profile("my-redis-config")
@Component
@ConfigurationProperties(prefix = "my-tcp-config")
public class MyTCPConfigProperties {
  private int tcp_user_timeout;

  public int getTcp_user_timeout() {
    return tcp_user_timeout;
  }

  public void setTcp_user_timeout(int tcp_user_timeout) {
    this.tcp_user_timeout = tcp_user_timeout;
  }
}
